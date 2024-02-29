package org.example.playlistinfo.config;

import io.github.bucket4j.*;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.Duration;

// リクエストのスロットリングを行うフィルター
public class ThrottingFilter implements Filter, jakarta.servlet.Filter {

    // 新しいバケットを作成する
    private Bucket createNewBucket() {
        long overdraft = 10;  // 最初に利用できるトークンの数
        Refill refill = Refill.greedy(5, Duration.ofSeconds(1));  // 1秒あたりに追加されるトークンの数
        Bandwidth limit = Bandwidth.classic(overdraft, refill);  // バケットの設定
        return Bucket4j.builder().addLimit(limit).build();  // バケットの作成
    }

    // フィルターの主要な動作
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpSession session = httpRequest.getSession(true);

        String appKey = httpRequest.getRemoteAddr();  // IPアドレスをキーとして使用
        Bucket bucket = (Bucket) session.getAttribute("throttler-" + appKey);  // セッションからバケットを取得
        if (bucket == null) {
            bucket = createNewBucket();  // バケットがなければ新規作成
            session.setAttribute("throttler-" + appKey, bucket);  // セッションにバケットを保存
        }

        if (bucket.tryConsume(1)) {  // トークンが消費できればリクエストを処理
            filterChain.doFilter(servletRequest, servletResponse);
        } else {  // トークンが消費できなければ429エラーを返す
            HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
            httpResponse.setContentType("text/plain");
            httpResponse.setStatus(429);
            httpResponse.getWriter().append("Too many requests");
        }
    }

    // フィルターの初期化
    @Override
    public void init(FilterConfig filterConfig) {
    }

    // フィルターの破棄
    @Override
    public void destroy() {
    }
}
