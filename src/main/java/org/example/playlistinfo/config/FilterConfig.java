package org.example.playlistinfo.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration // 設定クラスを示す
public class FilterConfig {

    private final HttpsEnforcer httpsEnforcer;

    @Autowired // 依存性注入を行う
    public FilterConfig(HttpsEnforcer httpsEnforcer) {
        this.httpsEnforcer = httpsEnforcer;
    }

    @Bean // Beanを生成する
    public FilterRegistrationBean<HttpsEnforcer> httpsEnforcerFilter() {
        FilterRegistrationBean<HttpsEnforcer> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(httpsEnforcer); // フィルタを設定する
        registrationBean.addUrlPatterns("/*"); // 全てのURLパターンに適用する

        return registrationBean; // 登録Beanを返す
    }

    @Bean // Beanを生成する
    public FilterRegistrationBean<ThrottingFilter> throttlingFilter() {
        FilterRegistrationBean<ThrottingFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new ThrottingFilter()); // フィルタを設定する
        registrationBean.addUrlPatterns("/*"); // 全てのURLパターンに適用する

        return registrationBean; // 登録Beanを返す
    }
}
