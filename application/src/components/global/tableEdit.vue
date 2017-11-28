<template>
    <div>
        <transition name="fade">
            <div id="modal-example" class="uk-modal" v-show="show" @click.self="close()">
                <div class="uk-modal-dialog uk-modal-body">
                    <button class="uk-modal-close-default uk-close uk-icon" type="button" @click="close()"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ratio="1"> <path fill="none" stroke="#000" stroke-width="1.06" d="M16,16 L4,4"></path> <path fill="none" stroke="#000" stroke-width="1.06" d="M16,4 L4,16"></path></svg></button>
                    <h4 class="uk-modal-title">{{title}}</h4>
                    <form action="" @submit.prevent="editEl()">
                        <template v-for="el in fields">
                            <div class="uk-margin-small">
                                <label class="uk-form-label">{{el.name}}</label>
                                <input v-if="el.type != 'tel' && el.type != 'desc' && el.type != 'select'" :type="el.type" class="uk-input" v-model="form[el.model]">
                                <select class="uk-select" v-else-if="el.type == 'select'" v-model="form[el.model]">
                                    <template v-if="el.model == 'status'">
                                        <option v-for="status in statuses" :value="status._id">{{status.title}}</option>
                                    </template>
                                    <template v-if="el.model == 'contactsId'">
                                        <option v-for="contact in contacts" :value="contact._id">{{contact.name}}</option>
                                    </template>
                                </select>
                                <textarea v-else-if="el.type == 'desc'" class="uk-textarea" v-model="form[el.model]"></textarea>
                                <masked-input v-else :type="el.type" class="uk-input" v-model="form[el.model]" mask="\+\7 (111) 111-1111" />
                            </div>
                        </template>
                        <div class="uk-margin"></div>
                        <div class="uk-text-right">
                            <button class="uk-button uk-button-default uk-modal-close" type="button" @click="close()">Отменить</button>
                            <button class="uk-button uk-button-primary" type="submit">Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { cloneDeep } from 'lodash'

    export default {
        props: {
            title: {
                type: String,
            },
            row: {
                type: Object,
                required: true
            },
            show: {
                type: Boolean,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            fields: {
                type: Array,
                required: true
            },
            statuses: {
                type: Array
            },
            contacts: {
                type: Array
            }
        },
        methods: {
            editEl: function () {
                this.$http.post(`${this.$APIURL}/api/v1/${this.type}/edit`, this.form, {
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}`},
                    params: { id: this.form.id }
                }).then(function(r) {
                    if (r.body.success) {
                        this.$emit('edited', r.body);
                    }
                    this.close();
                }, console.log);
            },
            close: function () {
                this.$emit('close', true);
            }
        },
        computed: {
            form: function(){
                return cloneDeep(this.row);
            }
        }
    }
</script>

<style>
    .uk-modal {
        display: block;
        opacity: 1;
    }
    .uk-modal-dialog {
        opacity: 1;
        transform: translateY(0)
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
        opacity: 0
    }
    .fade-enter .uk-modal-dialog, .fade-leave-to .uk-modal-dialog {
        opacity: 0;
        transform: translateY(-20%)
    }
</style>