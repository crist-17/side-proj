package com.pci.onbid.service;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.mapper.OnbidMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Scanner;

@Slf4j
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
     */
    public void fetchAndPrint() {
        try {
            int totalFetched = 0;
            int totalInserted = 0;
            int totalSkipped = 0;

            List<String> regions = List.of("서울특별시", "경기도");

            for (String region : regions) {
                log.info("🏙️ 현재 지역 수집 중: {}", region);

                for (int page = 1; page <= 2; page++) { // 테스트용 2페이지만 돌림
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }

                    String encodedRegion = URLEncoder.encode(region, StandardCharsets.UTF_8);
                    String url = baseUrl + "/getKamcoPbctCltrList"
                            + "?serviceKey=" + serviceKey
                            + "&numOfRows=100&pageNo=" + page
                            + "&DPSL_MTD_CD=0001"
                            + "&CTGR_HIRK_ID=10000"
                            + "&CTGR_HIRK_ID_MID=10100"
                            + "&SIDO=" + encodedRegion
                            + "&PBCT_BEGN_DTM=20150101"
                            + "&PBCT_CLS_DTM=20251231";

                    log.info("📡 요청 URL: {}", url);

                    // ✅ (1) 실제 응답 문자열 출력
                    String xmlResponse = fetchRawResponse(url);
                    System.out.println("📦 원본 응답 데이터 (앞부분 500자):\n"
                            + xmlResponse.substring(0, Math.min(500, xmlResponse.length())) + "\n");

                    Document doc = DocumentBuilderFactory.newInstance()
                            .newDocumentBuilder()
                            .parse(new java.io.ByteArrayInputStream(xmlResponse.getBytes(StandardCharsets.UTF_8)));
                    doc.getDocumentElement().normalize();

                    NodeList list = doc.getElementsByTagName("item");
                    log.info("📄 [{}] {}페이지 항목 수: {}", region, page, list.getLength());
                    totalFetched += list.getLength();

                    // ✅ (2) 만약 0건이면 중단 로그
                    if (list.getLength() == 0) {
                        log.warn("⚠️ [{}] 페이지 {} : item 태그 없음 — 응답 구조 확인 필요", region, page);
                        continue;
                    }

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
                        item.setCltrMnmtNo(getTagValue(e, "CLTR_MNMT_NO"));
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

                        // ✅ (3) 각 아이템 로그
                        log.debug("📍 물건명: {} | 주소: {}", cltrNm, item.getLdnmAdrs());

                        try {
                            int before = onbidMapper.findAll().size();
                            onbidMapper.insert(item);
                            int after = onbidMapper.findAll().size();

                            if (after > before) {
                                totalInserted++;
                            } else {
                                totalSkipped++;
                            }
                        } catch (Exception ex) {
                            totalSkipped++;
                            log.warn("⚠️ 중복/삽입 실패: {}", cltrNm);
                        }
                    }

                    Thread.sleep(1000); // 서버 부하 방지
                }
            }

            log.info("🎯 총 수집: {}건 | 저장 성공: {}건 | 중복 무시: {}건",
                    totalFetched, totalInserted, totalSkipped);

        } catch (Exception e) {
            log.error("❌ 데이터 수집 중 예외 발생", e);
        }
    }

    /**
     * ✅ API 응답을 문자열로 직접 가져오기
     */
    private String fetchRawResponse(String urlStr) {
        StringBuilder result = new StringBuilder();
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            try (InputStream in = conn.getInputStream();
                 Scanner scanner = new Scanner(in, StandardCharsets.UTF_8)) {
                while (scanner.hasNextLine()) {
                    result.append(scanner.nextLine()).append("\n");
                }
            }
        } catch (Exception e) {
            log.error("❌ API 호출 실패: {}", e.getMessage());
        }
        return result.toString();
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
