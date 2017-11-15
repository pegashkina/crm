<template>
    <main class="no-sidebar">
        <vheader>{{title}}</vheader>
        <form @submit.prevent="auth" class="uk-form-width-medium uk-align-center">
            <div class="uk-alert uk-alert-danger" v-if="error">
                <p>{{error}}</p>
            </div>
            <div class="uk-margin"><input type="text" class="uk-input" v-model="credentials.username" required></div>
            <div class="uk-margin"><input type="password" class="uk-input" v-model="credentials.password" required></div>
            <button class="uk-button uk-button-primary">Войти</button>
        </form>
        <vfooter></vfooter>
    </main>
</template>
<script>
    export default {
        data: () => ({
            title: '',
            error: '',
            credentials: {
                username: '',
                password: ''
            },
        }),
        methods: {
            auth: function () {
                var options = this.credentials;
                this.$http.post(`${this.$APIURL}/api/v1/auth`, options).then(function (data) {
                    console.log(data.body)
                    if (data.body.success) {
                        this.$cookie.set('token', data.body.token, '1D')
                        this.$router.push({ path: 'leads' })
                    }
                }).catch(function (e) {
                    if (!e.body.success) {
                        this.error = e.body.message
                    }
                });
            }
        },
        created: function () {
            this.title = this.$route.meta.title;
        }
    }
</script>