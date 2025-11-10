package com.pci.onbid.service;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.mapper.OnbidMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilderFactory;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OnbidService {

    private final OnbidMapper onbidMapper;

    @Value("${onbid.base-url}")
    private String baseUrl;

    @Value("${onbid.service-key}")
    private String serviceKey;

    /**
     * ✅ 서울 + 경기 공매물건 데이터 수집 및 DB 저장
     * - 중복은 DB에서 IGNORE로 무시됨
     * - 각 구간별 진행상황 및 건수 출력
     */
    public void fetchAndPrint() {
        try {
            int totalFetched = 0;   // API에서 받은 전체 데이터 개수
            int totalInserted = 0;  // DB에 실제 저장된 개수 (IGNORE 제외)
            int totalSkipped = 0;   // 중복으로 무시된 건수

            List<String> regions = List.of("서울특별시", "경기도");

            for (String region : regions) {
                System.out.println("\n🏙️ 현재 지역 수집 중: " + region);

                for (int page = 1; page <= 5; page++) {
                    String encodedRegion = URLEncoder.encode(region, StandardCharsets.UTF_8);
                    String url = baseUrl + "/getKamcoPbctCltrList"
                            + "?serviceKey=" + serviceKey
                            + "&numOfRows=20&pageNo=" + page
                            + "&DPSL_MTD_CD=0001"
                            + "&CTGR_HIRK_ID=10000"
                            + "&CTGR_HIRK_ID_MID=10100"
                            + "&SIDO=" + encodedRegion
                            + "&PBCT_BEGN_DTM=20150101"
                            + "&PBCT_CLS_DTM=20251231";

                    Document doc = DocumentBuilderFactory.newInstance()
                            .newDocumentBuilder()
                            .parse(url);
                    doc.getDocumentElement().normalize();

                    NodeList list = doc.getElementsByTagName("item");
                    System.out.println("📄 [" + region + "] " + page + "페이지 항목 수: " + list.getLength());

                    totalFetched += list.getLength();

                    for (int i = 0; i < list.getLength(); i++) {
                        Element e = (Element) list.item(i);
                        String cltrNm = getTagValue(e, "CLTR_NM");
                        if (cltrNm == null || cltrNm.isBlank()) continue;

                        // 🔹 불필요한 숫자·기호 제거
                        cltrNm = cltrNm.replaceAll("\\b\\d{1,3}-\\d{1,3}\\b", "")
                                .replaceAll("\\b\\d{1,3}\\b", "")
                                .replaceAll("[-,]", "")
                                .replaceAll("\\s{2,}", " ")
                                .trim();

                        OnbidItem item = new OnbidItem();
                        item.setPlnmNo(getTagValue(e, "PLNM_NO"));
                        item.setCltrNm(cltrNm);
                        item.setLdnmAdrs(getTagValue(e, "LDNM_ADRS"));
                        item.setMinBidPrc(getTagValue(e, "MIN_BID_PRC"));
                        item.setApslAsesAvgAmt(getTagValue(e, "APSL_ASES_AVG_AMT"));
                        item.setPbctBegnDtm(getTagValue(e, "PBCT_BEGN_DTM"));
                        item.setPbctClsDtm(getTagValue(e, "PBCT_CLS_DTM"));
                        item.setPbctCltrStatNm(getTagValue(e, "PBCT_CLTR_STAT_NM"));

                        // 🔹 주소에서 시/도 추출 (없으면 지역명 대체)
                        String address = item.getLdnmAdrs();
                        if (address != null && !address.isBlank()) {
                            item.setSido(address.split(" ")[0]);
                        } else {
                            item.setSido(region);
                        }

                        try {
                            int before = onbidMapper.findAll().size(); // insert 전 개수
                            onbidMapper.insert(item);
                            int after = onbidMapper.findAll().size();  // insert 후 개수
                            if (after > before) {
                                totalInserted++;
                            } else {
                                totalSkipped++;
                            }
                        } catch (Exception ex) {
                            totalSkipped++;
                            System.out.println("⚠️ 중복/삽입 실패: " + cltrNm);
                        }
                    }

                    Thread.sleep(1000); // 서버 부하 방지
                }
            }

            System.out.println("\n🎯 총 수집: " + totalFetched
                    + "건 | 저장 성공: " + totalInserted
                    + "건 | 중복 무시: " + totalSkipped + "건");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * ✅ XML 태그값 추출
     */
    private String getTagValue(Element e, String tag) {
        NodeList nodeList = e.getElementsByTagName(tag);
        if (nodeList.getLength() > 0 && nodeList.item(0).getTextContent() != null) {
            return nodeList.item(0).getTextContent();
        }
        return null;
    }

    /**
     * ✅ 전체 목록 조회
     */
    public List<OnbidItem> getAllItems() {
        return onbidMapper.findAll();
    }

    /**
     * ✅ 검색 (AND 조건 기반)
     */
    public List<OnbidItem> searchAdvanced(String region, String category, String status, Long minPrice, Long maxPrice) {
        return onbidMapper.searchAdvanced(region, category, status, minPrice, maxPrice);
    }
}
