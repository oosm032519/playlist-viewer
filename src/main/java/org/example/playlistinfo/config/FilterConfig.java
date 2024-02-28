package org.example.playlistinfo.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class FilterConfig {

    private final HttpsEnforcer httpsEnforcer;

    @Autowired
    public FilterConfig(HttpsEnforcer httpsEnforcer) {
        this.httpsEnforcer = httpsEnforcer;
    }

    @Bean
    public FilterRegistrationBean<HttpsEnforcer> httpsEnforcerFilter() {
        FilterRegistrationBean<HttpsEnforcer> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(httpsEnforcer);
        registrationBean.addUrlPatterns("/*"); // すべてのURLパターンに適用

        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<ThrottingFilter> throttlingFilter() {
        FilterRegistrationBean<ThrottingFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new ThrottingFilter());
        registrationBean.addUrlPatterns("/*"); // すべてのURLパターンに適用

        return registrationBean;
    }
}
