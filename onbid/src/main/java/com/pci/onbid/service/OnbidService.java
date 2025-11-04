package com.pci.onbid.service;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.mapper.OnbidMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilderFactory;

@Service
@RequiredArgsConstructor
public class OnbidService {

    private final OnbidMapper onbidMapper;

    @Value("${onbid.base-url}")
    private String baseUrl;

    @Value("${onbid.service-key}")
    private String serviceKey;

    public void fetchAndPrint() {
        try {
            // ✅ 실제 요청 URL (검증된 주소 기반)
            String url = baseUrl + "/getKamcoPbctCltrList"
                    + "?serviceKey=" + serviceKey
                    + "&numOfRows=10&pageNo=1"
                    + "&DPSL_MTD_CD=0001"
                    + "&CTGR_HIRK_ID=10000"
                    + "&CTGR_HIRK_ID_MID=10100"
                    + "&SIDO=경기도"
                    + "&PBCT_BEGN_DTM=20171218"
                    + "&PBCT_CLS_DTM=20251102";

            System.out.println("요청 URL: " + url);

            // ✅ XML 파싱
            Document doc = DocumentBuilderFactory.newInstance()
                    .newDocumentBuilder()
                    .parse(url);
            doc.getDocumentElement().normalize();

            NodeList list = doc.getElementsByTagName("item");
            System.out.println("가져온 데이터 개수: " + list.getLength());

            // ✅ 데이터 반복 처리
            for (int i = 0; i < list.getLength(); i++) {
                Element e = (Element) list.item(i);
                String name = getTagValue(e, "CLTR_NM");
                String addr = getTagValue(e, "LDNM_ADRS");
                String price = getTagValue(e, "MIN_BID_PRC");

                System.out.println("[" + (i + 1) + "] " + name + " | " + addr + " | " + price);

                // ✅ DB 저장
                OnbidItem item = new OnbidItem();
                item.setCltrNm(name);
                item.setLdnmAdrs(addr);
                item.setMinBidPrc(price);

                onbidMapper.insert(item);
            }

        } catch (Exception e) {
            System.out.println("❌ API 요청 또는 XML 파싱 중 오류 발생");
            e.printStackTrace();
        }
    }

    private String getTagValue(Element e, String tag) {
        Node n = e.getElementsByTagName(tag).item(0);
        return (n != null) ? n.getTextContent() : "";
    }
}
