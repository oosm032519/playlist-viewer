package org.example.playlistinfo.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<HttpsEnforcer> httpsEnforcerFilter() {
        FilterRegistrationBean<HttpsEnforcer> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new HttpsEnforcer());
        registrationBean.addUrlPatterns("/*"); // すべてのURLパターンに適用

        return registrationBean;
    }
}
