package org.example.playlistinfo.controller.user;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

// ユーザーのサインアップを処理するコントローラー
@Controller
public class UserSignupController {

    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // コンストラクタ
    public UserSignupController(AppUserRepository appUserRepository, BCryptPasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // サインアップリクエストを処理するメソッド
    @PostMapping("/signup")
    public String signup(@RequestParam("username") String username, @RequestParam("password") String password) {
        // ユーザー名とパスワードが空でないことを確認
        if (username.isEmpty() || password.isEmpty()) {
            return "redirect:/signup?error";
        }

        // 既に存在するユーザー名でないことを確認
        AppUser existingAppUser = appUserRepository.findByUsername(username);
        if (existingAppUser != null) {
            return "redirect:/signup?error";
        }

        // 新しいユーザーを作成し、パスワードをエンコードして保存
        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setPassword(passwordEncoder.encode(password));
        appUserRepository.save(appUser);

        // ユーザーをログインページにリダイレクト
        return "redirect:/login";
    }
}
