package org.example.playlistinfo.controller;

import org.example.playlistinfo.authorization.AuthorizationCodeUri;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/java")
public class SpotifyController {

    private final AuthorizationCodeUri authorizationCodeUri;

    public SpotifyController(AuthorizationCodeUri authorizationCodeUri) {
        this.authorizationCodeUri = authorizationCodeUri;
    }

    @GetMapping("/authorize")
    public ResponseEntity<String> authorize() {
        return authorizationCodeUri.authorizationCodeUri();
    }
}
