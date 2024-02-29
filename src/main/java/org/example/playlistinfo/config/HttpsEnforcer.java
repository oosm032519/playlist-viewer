package org.example.playlistinfo.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

// HTTPS強制クラス
@Component
public class HttpsEnforcer implements Filter, jakarta.servlet.Filter {
    public static final String X_FORWARDED_PROTO = "X-Forwarded-Proto";

    // 初期化メソッド
    @Override
    public void init(FilterConfig filterConfig) {
    }

    // フィルタ処理メソッド
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // リクエストがHTTPSでない場合、HTTPSにリダイレクト
        if (request.getHeader(X_FORWARDED_PROTO) != null) {
            if (request.getHeader(X_FORWARDED_PROTO).indexOf("https") != 0) {
                String pathInfo = (request.getPathInfo() != null) ? request.getPathInfo() : "";
                response.sendRedirect("https://" + request.getServerName() + pathInfo);
                return;
            }
        }

        // 次のフィルタにリクエストとレスポンスを渡す
        filterChain.doFilter(request, response);
    }

    // 破棄メソッド
    @Override
    public void destroy() {
    }
}
