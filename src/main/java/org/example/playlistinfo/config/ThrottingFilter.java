package org.example.playlistinfo.config;

import io.github.bucket4j.*;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.Duration;

public class ThrottingFilter implements Filter, jakarta.servlet.Filter {

    private Bucket createNewBucket() {
        long overdraft = 10;
        Refill refill = Refill.greedy(5, Duration.ofSeconds(1));
        Bandwidth limit = Bandwidth.classic(overdraft, refill);
        return Bucket4j.builder().addLimit(limit).build();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpSession session = httpRequest.getSession(true);

        String appKey = httpRequest.getRemoteAddr(); // IPアドレスをキーとして使用
        Bucket bucket = (Bucket) session.getAttribute("throttler-" + appKey);
        if (bucket == null) {
            bucket = createNewBucket();
            session.setAttribute("throttler-" + appKey, bucket);
        }

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
            httpResponse.setContentType("text/plain");
            httpResponse.setStatus(429);
            httpResponse.getWriter().append("Too many requests");
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
