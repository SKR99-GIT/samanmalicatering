package lk.samanmalicateringservice.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfig {
    
    // permission denn oni okkom file wlt naththm 4tos ehem load wenn nathi wei
    private String[] resourcesURL = { "/resources/**", "/controllers/**" };
    @Bean// mek functon ekk unata mek object ekk widihata hasirennd oni nisa
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity.authorizeHttpRequests((auth) ->{
           auth
            //permitAll kiyn eken user ekk athi nathi okkotm access deno e page ekt
            //mek filter wenn api browser eken ghn url ekt anuwa, ajax cl eke url ekath filter weno
            .requestMatchers(resourcesURL).permitAll() 
            .requestMatchers("/login").permitAll()
            .requestMatchers("/error").permitAll() 
            .requestMatchers("/createadmin").permitAll()
            //hasAnyAuthority kiyn eken ekt access tiyen role ekt withrai access denne page ekt
            .requestMatchers("/dashboard").hasAnyAuthority("Admin","Manager","Clerk","Receptionist","Chef") 
            .requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager", "Clerk")
            .requestMatchers("/user/**").hasAnyAuthority("Admin","Manager", "Clerk")
            .requestMatchers("/privilage/**").hasAnyAuthority("Admin","Manager","Clerk","Receptionist","Chef")
            .requestMatchers("/privilege/**").hasAnyAuthority("Admin","Manager")
            .requestMatchers("/report/**").hasAnyAuthority("Admin","Manager","Clerk","Receptionist","Chef")
            .requestMatchers("/customer/**").hasAnyAuthority("Admin","Manager","Receptionist","Clerk")
            .requestMatchers("/hall/**").hasAnyAuthority("Admin","Manager","Clerk","Receptionist")
            .requestMatchers("/service/**").hasAnyAuthority("Admin","Manager","Clerk","Receptionist")
            .requestMatchers("/supplier/**").hasAnyAuthority("Admin","Manager","Clerk","Receptionist")
            .requestMatchers("/ingredients/**").hasAnyAuthority("Admin","Manager","Clerk","Chef")
            .requestMatchers("/menu/**").hasAnyAuthority("Admin","Manager","Clerk","Chef","Receptionist")
            .requestMatchers("/submenu/**").hasAnyAuthority("Admin","Manager","Clerk","Chef","Receptionist")
            .requestMatchers("/reservation/**").hasAnyAuthority("Admin","Manager","Clerk","Chef","Receptionist")
            .requestMatchers("/payment/**").hasAnyAuthority("Admin","Manager","Clerk","Receptionist")
            .requestMatchers("/porder/**").hasAnyAuthority("Admin","Manager","Clerk")
            .requestMatchers("/irn/**").hasAnyAuthority("Admin","Manager","Clerk")
            .requestMatchers("/supplierpayment/**").hasAnyAuthority("Admin","Manager","Clerk")
            .requestMatchers("/inventory/**").hasAnyAuthority("Admin","Manager","Clerk", "Chef")
            .requestMatchers("/garbage/**").hasAnyAuthority("Admin","Manager", "Chef")
            .requestMatchers("/kitchen/**").hasAnyAuthority("Admin","Manager", "Chef","Clerk","Receptionist")
            .requestMatchers("/delivery/**").hasAnyAuthority("Admin","Manager", "Chef","Clerk","Receptionist")
            .anyRequest().authenticated();
        })

                //loging details handler
                .formLogin((login) -> // oni nm {} dann puluwn nathath aulk naa, hbi dmmoth ehem ; aniwa oni
                login
                .loginPage("/login")//login ui service
                .usernameParameter("username")//login ui username feild name attribute value need to equal to user entity username property
                .passwordParameter("password")//login ui password feild name attribute value need to equal to user entity password property
                .defaultSuccessUrl("/dashboard",true) //login ek success nm ilagata ena url ek, meke true false dann api logout wela aaye login weddi apit ynnd oni hitapu thanatm nm methn false naththm dashboard ekt nm true
                .failureUrl("/login?error=invalidusernamepassword") //login failur url
                //login ekem error param(meke athule value ekk tiyeno nm withrak) ekk tiyenod balala tmi error ek return krnn
                )
            //logout details
            .logout((logout) -> {
                logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login");
            }
             //csrf (browser eken pita access krana ek block krno csrf nisa(apit ajax ewa ehem gnnd epai ek nisa mek mehem wela baa itim), mek by default enable wela tiyenn)(cross reference disabled krnnd oni)
    ).csrf((csrf) -> csrf.disable() // for access services url using ajax call
    )
    .exceptionHandling((exp) -> exp.accessDeniedPage("/error")
    );

        //session details
        //exception

        //csrf (browser eken pita access krana ek block krno, mek by default enable wela tiyenn)

        //api illana method ekt tmi filterchain ek liyannd ynn(httpSecurity)
        return httpSecurity.build();
    }

    //password encription object
    @Bean
    //mek gann ape db eke encrypt wela tiyen password ek ai api ghn original password ekai encrypt krl samsanaid kiyl blnnd oni nisa
    //emk podi aulk tiyeno mek oneway,ekt soluttion ekk widihata match liyn eken wisadnn puluwn
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
