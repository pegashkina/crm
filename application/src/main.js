import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';

// Подключение страниц для роутера
import Contacts from './Contacts.vue';
import ContactDetail from './ContactDetail.vue';
import Leads from './Leads.vue';
import LeadDetail from './LeadDetail.vue';
import Auth from './Authentication.vue';
import Settings from './AdminSettings.vue';
import Statuses from './Statuses.vue';

// Подключение компонентов
import sidebar from './components/global/sidebar.vue';
import vheader from './components/global/header.vue';
import vfooter from './components/global/footer.vue';
import maskedInput from 'vue-masked-input';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueCookie);
Vue.component('sidebar', sidebar);
Vue.component('vheader', vheader);
Vue.component('vfooter', vfooter);
Vue.component('maskedInput', maskedInput);

Vue.prototype.$APIURL = `http://${window.location.hostname}:3001`;

var router = new VueRouter({
    routes: [
        { path: '/', redirect: '/leads', meta: {requiredAuth: true} },
        { path: '/login', name: 'auth', component: Auth, meta: {title: "Войти"} },
        { path: '/contacts', component: Contacts, meta: {title: "Контакты", requiredAuth: true} },
        { path: '/contacts/:id', name: 'contact', component: ContactDetail, meta: {title: "Подробная информация по контакту", requiredAuth: true} },
        { path: '/leads', component: Leads, meta: {title: "Сделки", requiredAuth: true} },
        { path: '/leads/:id', name: 'lead', component: LeadDetail, meta: {title: "Подробная информация по сделкам", requiredAuth: true} },
        { path: '/settings', component: Settings, meta: {title: "Администрирование", requiredAuth: true} },
        { path: '/statuses', component: Statuses, meta: {title: "Статусы сделок", requiredAuth: true} },
    ]
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? to.meta.title : 'Страница без имени';

    if (to.meta.requiredAuth) {
        if (!!document.cookie) {
            next()
        } else {
            router.push('/login')
        }
    } else {
        next()
    }
});

new Vue({
    el: '#app',
    router: router,
    method: {
        checkAuthentication: function () {
            const token = document.cookie;
            return !!token;
        }
    }
});
