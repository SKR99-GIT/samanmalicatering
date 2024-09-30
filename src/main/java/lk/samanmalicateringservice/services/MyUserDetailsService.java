package lk.samanmalicateringservice.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.samanmalicateringservice.user.dao.UserDao;
import lk.samanmalicateringservice.user.entity.Role;
import lk.samanmalicateringservice.user.entity.User;

@Service//apit meken service hmben nisa me annotation ek dagnno
//meken tmi ape password ok d apit user account ekk tiyenod kiyl blnn ehem
public class MyUserDetailsService implements UserDetailsService{

//dependency injection
@Autowired
private UserDao userDao;
    //meken tmi ape password ok d apit user account ekk tiyenod kiyl blnn ehem--> ekt adala object ek pass krnn meken
    //meken tmi adala user detail object ek genn gann
    @Override
    @Transactional //methana userge table dekk use wenonh, me annotation ek naththm e dekam gnnd widihak naane
    //mek UserDetailsService athule tiyen function ekk apit mek wenass krnnd baa override krl gnnd withrai puluwn 
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
          //given username ek use krl user object ek genn gannwa security file ekt
        User logedUser = userDao.getByUserName(username);

        //empty array list ekk hdgnnwa
        ArrayList<GrantedAuthority> authorities = new ArrayList<>();

        //logeduser eke list ek(User list ekknh ethnata enn) argen ek covert krgnnd oni GrantedAuthority list ekk bawata
        for (Role role : logedUser.getRoles()){ //read user role list using for loop
            //GrantedAuthority list eke illnn e jathiyem ekknh, ekai api SimpleGrantedAuthority hdgnn(apit GrantedAuthority ekkm hdgnnd baa ek nisa e jathiyata samana ekk tmi simple dala hdnn),-
            //-ekedi ilnn role eknh eke type ek role kiyl, eth SimpleGrantedAuthority ilnn string ekknh ekai eke .getName ek gnn
            authorities.add(new SimpleGrantedAuthority(role.getName())); //add GrantedAuthority object into authorities array using user name 
        }

        //return krnwa security user object ekk ekt oni krn parameters tika add krgenm
        return new org.springframework.security.core.userdetails.User(logedUser.getUsername(),logedUser.getPassword(),logedUser.getStatus(),
        true,true,true,authorities);
    }
    
}
