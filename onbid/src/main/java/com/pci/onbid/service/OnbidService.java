package com.pci.onbid.service;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.mapper.OnbidMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;

/**
 * 온비드 API 호출 → XML 파싱 → DB 저장까지 전체 흐름 담당
 */
@Service
@RequiredArgsConstructor
public class OnbidService {

    // ✅ MyBatis 매퍼 주입
    private final OnbidMapper onbidMapper;

    // ✅ application.properties에서 불러오기
    @Value("${onbid.base-url}")
    private String baseUrl;

    @Value("${onbid.service-key}")
    private String serviceKey;

    /**
     * 온비드 API를 호출하여 XML 데이터를 가져오고 DB에 저장한다.
     */
    public void fetchAndPrint() {
        try {
            // ✅ 1. 실제 요청 URL 구성
            String url = this.baseUrl + "/getOfferRealList"
                    + "?pageNo=1"
                    + "&numOfRows=10"
                    + "&ServiceKey=" + serviceKey;  // ⚠️ 대문자 S!

            System.out.println("요청 URL: " + url);

            // ✅ 2. XML 문서 파싱
            Document doc = DocumentBuilderFactory.newInstance()
                    .newDocumentBuilder()
                    .parse(url);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagName("item");
            System.out.println("가져온 데이터 개수: " + nodeList.getLength());

            // ✅ 3. 각 item 태그별로 데이터 추출 & DB 저장
            for (int i = 0; i < nodeList.getLength(); i++) {
                Element e = (Element) nodeList.item(i);

                // XML에서 필요한 태그 추출
                String name = getTagValue(e, "CLTR_NM");       // 물건명
                String addr = getTagValue(e, "LDNM_ADRS");     // 주소
                String price = getTagValue(e, "MIN_BID_PRC");  // 최저입찰가

                // 콘솔 출력
                System.out.println("[" + (i + 1) + "] " + name + " | " + addr + " | " + price);

                // DTO 생성 후 데이터 세팅
                OnbidItem item = new OnbidItem();
                item.setCltrNm(name);
                item.setLdnmAdrs(addr);
                item.setMinBidPrc(price);

                // ✅ 4. DB 저장 (MyBatis)
                onbidMapper.insert(item);
                System.out.println("저장됨 ▶ " + item.getCltrNm());
            }

        } catch (Exception e) {
            System.out.println("❌ API 요청 또는 XML 파싱 중 에러 발생");
            e.printStackTrace();
            System.out.println("에러 내용: " + e.getMessage());
        }
    }

    /**
     * XML 태그의 텍스트 값을 안전하게 꺼내는 헬퍼 메서드
     */
    private String getTagValue(Element e, String tag) {
        Node n = e.getElementsByTagName(tag).item(0);
        return (n != null) ? n.getTextContent() : "";
    }
}
