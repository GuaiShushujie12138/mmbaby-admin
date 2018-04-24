package com.mmbaby.admin.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Wanghui Fu
 * Created by Guaishushu on 2018/4/24 at 17:00
 */

@RestController
public class WebHomeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebHomeController.class);

    /**
     * 登录页面
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/login.xhtml", method = RequestMethod.GET)
    public ModelAndView authorize(HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ModelAndView view = new ModelAndView("home/authfail");
        String errorMsg = "";

        //打开登录页面
        view.setViewName("home/login");

        return view;
    }

}
