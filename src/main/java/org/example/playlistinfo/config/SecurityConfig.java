package org.example.playlistinfo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // このクラスが設定クラスであることを示す
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    // コンストラクタ
    public SecurityConfig(final UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean // SpringのDIコンテナに登録するBeanを定義
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        // "/login"と"/signup"へのリクエストは認証なしで許可
                        .requestMatchers("/login", "/signup").permitAll()
                        // それ以外のリクエストは認証が必要
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login
                        // ログインページのパスを設定
                        .loginPage("/login")
                        // ログイン成功後のリダイレクト先を設定
                        .defaultSuccessUrl("/", true)
                        // ログインページへのアクセスは認証なしで許可
                        .permitAll()
                )
                // ログアウトへのリクエストは認証なしで許可
                .logout(LogoutConfigurer::permitAll)
                // UserDetailsServiceを設定
                .userDetailsService(userDetailsService);
        return http.build();
    }

    @Bean // SpringのDIコンテナに登録するBeanを定義
    public BCryptPasswordEncoder passwordEncoder() {
        // パスワードエンコーダーを返す
        return new BCryptPasswordEncoder();
    }
}
