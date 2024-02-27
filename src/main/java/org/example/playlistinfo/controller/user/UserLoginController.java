package org.example.playlistinfo.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller // このクラスがSpring MVCのコントローラーであることを示す
public class UserLoginController {

    // "/login"というURLへのGETリクエストをハンドルするメソッド
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login"; // "login"という名前のビューを返す
    }
}
