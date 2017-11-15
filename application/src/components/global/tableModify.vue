<template>
    <transition name="fade">
        <div v-show="!!selectedRows.length" class="stickyBottom">
            <select class="uk-select uk-form-width-medium" v-model="select">
                <option value="none">Выберите действие</option>
                <option value="edit" v-if="selectedRows.length == 1">Редактировать</option>
                <option value="remove">Удалить</option>
            </select>
            <button class="uk-button uk-button-primary" @click.prevent="submit()">Применить</button>
        </div>
    </transition>
</template>

<script>
    module.exports = {
        props: {
            selectedRows: {
                type: Array,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        },
        data: () => ({
            select: 'none',
            show: false,
            form: {
                firstname: '',
                tel: '',
                email: '',
                city: ''
            }
        }),
        methods: {
            removeEl: function () {
                this.$http.post(`${this.$APIURL}/api/v1/${this.type}/remove`, {ids: this.selectedRows},{
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}` }
                }).then(function(r) {
                    if (r.body.success) {
                        this.$emit('deleted', r.body);
                    }
                }, console.log);
            },
            submit: function () {
                switch (this.select) {
                    case 'remove':
                        this.removeEl();
                        break;
                    case 'edit':
                        this.$emit('toEdit', this.selectedRows[0]);
                        break;
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                var d=document,w=window,m=d.querySelector('.stickyBottom'),l='getBoundingClientRect',i='innerHeight',c='classList',h='height',t='top',b='add',r='remove',e='addEventListener',p=d.createElement('div'),s=()=>{if(w[i]-m[l]()[h]<p[l]()[t]&&!a){m[c][b]('sticky');a=!a;}else if(w[i]-m[l]()[h]>=p[l]()[t]&&a){m[c][r]('sticky');a=!a;}};m.parentNode.insertBefore(p,m);var a=(w[i]-m[l]()[h]<p[l]()[t]);if(a)m[c][b]('sticky');w[e]('scroll',s);w[e]('resize',s);
            })
        }
    }
</script>

<style>
    .sticky {
        bottom: 0;
        position: fixed;
        z-index: 10;
    }
</style>