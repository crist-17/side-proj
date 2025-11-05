package com.pci.onbid.service;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.mapper.OnbidMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilderFactory;
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
     * ✅ 온비드 API에서 여러 페이지(예: 1~5페이지)까지 반복 호출하여 DB 저장
     * 중복 데이터는 INSERT IGNORE로 무시됨.
     */
    public void fetchAndPrint() {
        try {
            int totalSaved = 0; // 누적 저장 개수

            // ✅ 페이지 1~5까지 자동 반복 (50개 × 5 = 최대 250건)
            for (int page = 1; page <= 5; page++) {
                String url = baseUrl + "/getKamcoPbctCltrList"
                        + "?serviceKey=" + serviceKey
                        + "&numOfRows=20&pageNo=" + page // ✅ 페이지 변수 추가
                        + "&DPSL_MTD_CD=0001"
                        + "&CTGR_HIRK_ID=10000"
                        + "&CTGR_HIRK_ID_MID=10100"
                        + "&SIDO=경기도"
                        + "&PBCT_BEGN_DTM=20150101"
                        + "&PBCT_CLS_DTM=20251102";

                System.out.println("📡 요청 URL(" + page + "): " + url);

                Document doc = DocumentBuilderFactory.newInstance()
                        .newDocumentBuilder()
                        .parse(url);
                doc.getDocumentElement().normalize();

                NodeList list = doc.getElementsByTagName("item");
                System.out.println("✅ " + page + "페이지 데이터 개수: " + list.getLength());

                // ✅ 각 물건 데이터 처리
                for (int i = 0; i < list.getLength(); i++) {
                    Element e = (Element) list.item(i);
                    String name = getTagValue(e, "CLTR_NM");
                    String addr = getTagValue(e, "LDNM_ADRS");
                    String price = getTagValue(e, "MIN_BID_PRC");

                    // 빈값 또는 중복 가능성 높은 항목은 스킵
                    if (name == null || name.isBlank()) continue;

                    OnbidItem item = new OnbidItem();
                    item.setCltrNm(name.trim());
                    item.setLdnmAdrs(addr != null ? addr.trim() : "-");
                    item.setMinBidPrc(price != null ? price.trim() : "-");

                    onbidMapper.insert(item);
                    totalSaved++;
                }

                // 페이지 사이 간격 (서버 부하 방지)
                Thread.sleep(1000);
            }

            System.out.println("🎯 총 저장된 데이터 수: " + totalSaved);

        } catch (Exception e) {
            System.out.println("❌ API 요청 또는 XML 파싱 중 오류 발생");
            e.printStackTrace();
        }
    }

    // ✅ 태그 값 안전 추출
    private String getTagValue(Element e, String tag) {
        Node n = e.getElementsByTagName(tag).item(0);
        return (n != null) ? n.getTextContent() : "";
    }

    // ✅ 전체 목록 조회
    public List<OnbidItem> getAllItems() {
        return onbidMapper.findAll();
    }

    // ✅ 검색 기능
    public List<OnbidItem> search(String keyword) {
        return onbidMapper.search(keyword);
    }
}
