package org.example.playlistinfo.controller.user;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller  // コントローラークラス
public class UserSignupController {

    private final AppUserRepository appUserRepository;  // ユーザーリポジトリ
    private final BCryptPasswordEncoder passwordEncoder;  // パスワードエンコーダー

    // コンストラクタ
    public UserSignupController(AppUserRepository appUserRepository, BCryptPasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // サインアップ処理
    @PostMapping("/signup")
    public String signup(@RequestParam("username") String username, @RequestParam("password") String password) {
        if (!validateInput(username, password)) {  // 入力検証
            return "redirect:/signup?error";
        }

        if (!createUser(username, password)) {  // ユーザー作成
            return "redirect:/signup?error";
        }

        return "redirect:/login";
    }

    // 入力検証
    protected boolean validateInput(String username, String password) {
        return isNotEmpty(username) && isNotEmpty(password) && isUsernameAvailable(username);
    }

    // 入力が空でないか検証
    protected boolean isNotEmpty(String input) {
        return !input.isEmpty();
    }

    // ユーザー名が利用可能か検証
    protected boolean isUsernameAvailable(String username) {
        return appUserRepository.findByUsername(username) == null;
    }

    // ユーザー作成
    protected boolean createUser(String username, String password) {
        AppUser appUser = createAppUser(username, password);
        appUserRepository.save(appUser);
        return true;
    }

    // AppUserオブジェクト作成
    protected AppUser createAppUser(String username, String password) {
        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setPassword(passwordEncoder.encode(password));
        return appUser;
    }
}
