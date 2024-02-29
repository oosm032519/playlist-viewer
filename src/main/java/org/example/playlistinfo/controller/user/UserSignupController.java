package org.example.playlistinfo.controller.user;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UserSignupController {

    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserSignupController(AppUserRepository appUserRepository, BCryptPasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public String signup(@RequestParam("username") String username, @RequestParam("password") String password) {
        if (!validateInput(username, password)) {
            return "redirect:/signup?error";
        }

        if (!createUser(username, password)) {
            return "redirect:/signup?error";
        }

        return "redirect:/login";
    }

    protected boolean validateInput(String username, String password) {
        return isNotEmpty(username) && isNotEmpty(password) && isUsernameAvailable(username);
    }

    protected boolean isNotEmpty(String input) {
        return !input.isEmpty();
    }

    protected boolean isUsernameAvailable(String username) {
        return appUserRepository.findByUsername(username) == null;
    }

    protected boolean createUser(String username, String password) {
        AppUser appUser = createAppUser(username, password);
        appUserRepository.save(appUser);
        return true;
    }

    protected AppUser createAppUser(String username, String password) {
        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setPassword(passwordEncoder.encode(password));
        return appUser;
    }
}
