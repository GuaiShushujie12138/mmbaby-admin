package com.mmbaby.admin.interceptor;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Wanghui Fu
 * Created by Guaishushu on 2018/4/24 at 14:02
 */
public class RequestLoggingInterceptor extends HandlerInterceptorAdapter {

    // private static final Logger LOGGER = LoggerFactory.getLogger(RequestLoggingInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

//        Integer userId = (Integer) request.getAttribute(Constants.REQUEST_USER);

//        String uri = request.getRequestURL().toString();

//        LOGGER.info("User {} attempt to access {}", userId, uri);

        return true;
    }
}
