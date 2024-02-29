package org.example.playlistinfo.utils;

import org.example.playlistinfo.entity.AppUser;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {

    public static Map<String, Object> createResponse(AppUser appUser) {
        Map<String, Object> response = new HashMap<>();
        if (appUser != null) {
            response.put("id", appUser.getId());
            response.put("username", appUser.getUsername());
        } else {
            response.put("message", "未ログイン");
        }
        return response;
    }
}
