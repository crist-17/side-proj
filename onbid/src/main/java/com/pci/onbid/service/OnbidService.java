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

    // ✅ 데이터 수집 및 저장
    public void fetchAndPrint() {
        try {
            int totalSaved = 0;

            for (int page = 1; page <= 5; page++) {
                String url = baseUrl + "/getKamcoPbctCltrList"
                        + "?serviceKey=" + serviceKey
                        + "&numOfRows=20&pageNo=" + page
                        + "&DPSL_MTD_CD=0001"
                        + "&CTGR_HIRK_ID=10000"
                        + "&CTGR_HIRK_ID_MID=10100"
                        + "&SIDO=경기도"
                        + "&PBCT_BEGN_DTM=20150101"
                        + "&PBCT_CLS_DTM=20251102";

                Document doc = DocumentBuilderFactory.newInstance()
                        .newDocumentBuilder()
                        .parse(url);
                doc.getDocumentElement().normalize();

                NodeList list = doc.getElementsByTagName("item");
                System.out.println("✅ " + page + "페이지 데이터 개수: " + list.getLength());

                for (int i = 0; i < list.getLength(); i++) {
                    Element e = (Element) list.item(i);
                    String cltrNm = getTagValue(e, "CLTR_NM");
                    if (cltrNm == null || cltrNm.isBlank()) continue;

                    OnbidItem item = new OnbidItem();
                    item.setPlnmNo(getTagValue(e, "PLNM_NO"));
                    item.setCltrNm(cltrNm.trim());
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
                        item.setSido("미지정");
                    }

                    onbidMapper.insert(item);
                    totalSaved++;
                }
                Thread.sleep(1000);
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

    public List<OnbidItem> search(String keyword) {
        return onbidMapper.search(keyword);
    }
}
