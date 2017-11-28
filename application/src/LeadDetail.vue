<template>
    <main>
        <vheader>{{title}}</vheader>
        <dl class="uk-description-list uk-description-list-divider">
            <dt>Описание</dt>
            <dd v-html="this.$options.filters.n2br(details.description)"></dd>
            <dt>Статус</dt>
            <dd><span class="uk-badge" :style="'color: #333; background: ' + statuses.color">{{statuses.title}}</span></dd>
            <dt>Контакты</dt>
            <dd><router-link :to="'/contacts/' + contacts._id">{{contacts.name}}</router-link><br>
                {{contacts.tel}}
            </dd>
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
        filters: {
            n2br: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.replace('\n', '<br>')
            }
        },
        data: function() {
            return {
                title: '',
                details: {},
                statuses: {},
                contacts: {}
            }
        },
        methods: {
            getDetails: function() {
                this.$http.get(`${this.$APIURL}/api/v1/lead/get`,{
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}` },
                    params: { id: this.$route.params.id }
                }).then(function(r) {
                    this.details = r.body;
                    this.title = this.details.title;
                    this.getStatus(this.details.status);
                    this.getContacts(this.details.contactsId);
                }, console.log);
            },
            getStatus: function (a) {
                this.$http.get(`${this.$APIURL}/api/v1/status/get`, {
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}`},
                    params: { id: a }
                }).then(function(r) {
                    this.statuses = r.body;
                }).catch(console.error);
            },
            getContacts: function (a) {
                this.$http.get(`${this.$APIURL}/api/v1/contact/get`, {
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}`},
                    params: { id: a }
                }).then(function(r) {
                    this.contacts = r.body;
                }).catch(console.error);
            }
        },
        created: function() {
            this.getDetails();
        }
    }
</script>