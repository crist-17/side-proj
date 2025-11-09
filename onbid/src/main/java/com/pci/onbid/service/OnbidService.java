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
     * ✅ 경기도 + 서울특별시 데이터 수집 및 저장
     */
    public void fetchAndPrint() {
        try {
            int totalSaved = 0;
            List<String> regions = List.of("경기도", "서울특별시");

            for (String region : regions) {
                System.out.println("🏙️ 현재 수집 중: " + region);

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
                            + "&PBCT_CLS_DTM=20251102";

                    Document doc = DocumentBuilderFactory.newInstance()
                            .newDocumentBuilder()
                            .parse(url);
                    doc.getDocumentElement().normalize();

                    NodeList list = doc.getElementsByTagName("item");
                    System.out.println("✅ [" + region + "] " + page + "페이지 데이터 개수: " + list.getLength());

                    for (int i = 0; i < list.getLength(); i++) {
                        Element e = (Element) list.item(i);
                        String cltrNm = getTagValue(e, "CLTR_NM");
                        if (cltrNm == null || cltrNm.isBlank()) continue;

                        // 🔹 지번/숫자 제거 처리
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

                        String address = item.getLdnmAdrs();
                        if (address != null && !address.isBlank()) {
                            item.setSido(address.split(" ")[0]);
                        } else {
                            item.setSido(region);
                        }

                        try {
                            onbidMapper.insert(item);
                            totalSaved++;
                        } catch (Exception ex) {
                            System.out.println("⚠️ 중복 또는 삽입 실패: " + cltrNm);
                        }
                    }

                    Thread.sleep(1000);
                }
            }

            System.out.println("🎯 총 저장된 데이터 수: " + totalSaved);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getTagValue(Element e, String tag) {
        NodeList nodeList = e.getElementsByTagName(tag);
        if (nodeList.getLength() > 0 && nodeList.item(0).getTextContent() != null) {
            return nodeList.item(0).getTextContent();
        }
        return null;
    }

    public List<OnbidItem> getAllItems() {
        return onbidMapper.findAll();
    }

    // ✅ 세분화 검색 (AND 조건 기반)
    public List<OnbidItem> searchAdvanced(String region, String category, String status, Long minPrice, Long maxPrice) {
        return onbidMapper.searchAdvanced(region, category, status, minPrice, maxPrice);
    }
}
