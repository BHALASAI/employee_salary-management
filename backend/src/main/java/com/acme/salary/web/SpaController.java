package com.acme.salary.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping({"/", "/login", "/dashboard", "/employees", "/employees/new", "/employees/{id}/edit"})
    public String forwardToAngular() {
        return "forward:/index.html";
    }
}
