package org.example.playlistinfo.security;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service // このクラスをSpringのサービスとして登録
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    // AppUserRepositoryを注入するコンストラクタ
    public UserDetailsServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    // ユーザー名に基づいてユーザー詳細をロードするメソッド
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepository.findByUsername(username);

        // ユーザーが見つからない場合は例外をスロー
        if (appUser == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // 見つかったユーザーをSpring SecurityのUserオブジェクトに変換
        return new org.springframework.security.core.userdetails.User(appUser.getUsername(), appUser.getPassword(), new ArrayList<>());
    }
}
