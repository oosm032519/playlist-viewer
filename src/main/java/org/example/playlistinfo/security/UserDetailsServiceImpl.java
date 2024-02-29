package org.example.playlistinfo.security;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service  // サービスクラスを示すアノテーション
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;  // ユーザー情報のリポジトリ
    private final UserDetailsConverter userDetailsConverter;  // ユーザー詳細情報のコンバーター

    // コンストラクタ
    public UserDetailsServiceImpl(AppUserRepository appUserRepository, UserDetailsConverter userDetailsConverter) {
        this.appUserRepository = appUserRepository;
        this.userDetailsConverter = userDetailsConverter;
    }

    // ユーザー名に基づいてユーザー詳細情報をロードするメソッド
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> optionalAppUser = Optional.ofNullable(appUserRepository.findByUsername(username));

        // ユーザーが存在すればそのユーザー詳細情報を返し、存在しなければ例外をスローする
        return optionalAppUser.map(userDetailsConverter::convert)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
