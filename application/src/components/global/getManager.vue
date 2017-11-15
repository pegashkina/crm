<template>
    <p>{{ manager.lastName + ' ' + manager.firstName}}</p>
</template>

<script>
    module.exports = {
        props: {
            managerId: {
                type: String,
                required: true
            }
        },
        data: () => ({
            manager: {
                firstName: '',
                lastName: ''
            }
        }),
        methods: {
            getManager: function () {
                this.$http.get(`${this.$APIURL}/api/v1/user/get`,{
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}` },
                    params: { id: this.managerId }
                }).then(function(r) {
                    this.manager = r.body;
                }).catch(function (e) {
                    console.log(e);
                })
            }
        },
        created: function () {
            this.getManager()
        }
    }
</script>