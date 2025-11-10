package com.pci.onbid.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {


    // ✅ Swagger UI 접속 주소
// http://localhost:8092/swagger-ui/index.html
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("📘 Onbid API 문서")
                        .description("공공데이터 온비드 API + 내부 DB 연동 REST API 문서")
                        .version("1.0.0"));
    }
}
