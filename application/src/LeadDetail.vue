<template>
    <main>
        <vheader>{{title}}</vheader>
        <dl class="uk-description-list uk-description-list-divider">
            <dt>Описание</dt>
            <dd v-html="this.$options.filters.n2br(details.description)"></dd>
            <dt>Статус</dt>
            <dd>{{details.status}}</dd>
            <dt>Контакты</dt>
            <dd>{{details.contactsId}}</dd>
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
                details: {}
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
                }, console.log);
            }
        },
        created: function() {
            this.getDetails();
        }
    }
</script>