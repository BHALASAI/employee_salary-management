package com.acme.salary.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping({"/", "/login", "/dashboard", "/employees", "/employees/new"})
    public String forwardToAngular() {
        return "forward:/index.html";
    }

    @GetMapping("/employees/{id}/edit")
    public String forwardToAngularWithId(@org.springframework.web.bind.annotation.PathVariable long id) {
        return forwardToAngular();
    }
}
