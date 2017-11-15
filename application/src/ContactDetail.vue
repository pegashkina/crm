<template>
    <main>
        <vheader>{{title}}</vheader>
        <dl class="uk-description-list uk-description-list-divider">
            <dt>Номер телефона</dt>
            <dd><template v-for="el in details.tel">{{el}}</template></dd>
            <dt>Email</dt>
            <dd><template v-for="el in details.email">{{el}}</template></dd>
            <dt>Адрес клиента</dt>
            <dd>{{details.city}}</dd>
            <dt>Менеджер-создатель</dt>
            <dd><get-info v-if="!!details._id" :managerId="details.manager" /></dd>
        </dl>
        <vfooter></vfooter>
    </main>
</template>

<script>
    import getInfo from './components/global/getManager.vue'

    export default {
        components: {
            getInfo: getInfo
        },
        data: function() {
            return {
                title: '',
                details: {}
            }
        },
        methods: {
            getDetails: function() {
                this.$http.get(`${this.$APIURL}/api/v1/contact/get`,{
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}` },
                    params: { id: this.$route.params.id }
                }).then(function(r) {
                    this.details = r.body;
                    this.title = this.details.name;
                }, console.log);
            }
        },
        created: function() {
            this.getDetails();
        }
    }
</script>