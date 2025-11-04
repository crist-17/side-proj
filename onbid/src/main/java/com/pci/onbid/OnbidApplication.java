package com.pci.onbid;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.pci.onbid.mapper")
public class OnbidApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnbidApplication.class, args);
    }

}
