<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, maxLength } from '@vuelidate/validators'

const phone = v => {
  if (typeof v === 'undefined' || v.length === 0) return true

  const cleaned = v.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return true;
  } else return cleaned.length === 11 && cleaned[0] === '1';
}

const defaultState = {}
const state = reactive({
  name: '',
  tel: '',
  email: ''
})

onMounted(() => Object.assign(defaultState, state))

const rules = {
  name: { required, maxLength: maxLength(50) },
  tel: {
    phone: helpers.withMessage('Invalid phone format', phone)
  },
  email: {
    required,
    email: helpers.withMessage('Invalid email format', email)
  }
}

const v$ = useVuelidate(rules, state)

const formDisabled = ref(false)

async function validate() {
  if (await v$.value.$validate() === false) return false

  v$.value.$reset()
  Object.assign(state, defaultState)
  return state
}

defineExpose({
  validate
});

</script>

<template>
  <form class="chat-form">
    <div class="chat-form__row">
      <input v-model.trim="state.name" :class="{ invalid: v$.name.$error }" :disabled="formDisabled"
             class="chat-form__field" type="text" name="chat-form-name" placeholder="Your Name"
             autocomplete="given-name">
      <template v-if="v$.name.$errors.length">
        <div v-for="error in v$.name.$errors" :key="error.$uid" class="chat-form__error">{{ error.$message }}</div>
      </template>
    </div>
    <div class="chat-form__row">
      <input v-model.trim="state.tel" :class="{ invalid: v$.tel.$error }" :disabled="formDisabled"
             class="chat-form__field" type="text" name="chat-form-tel" placeholder="Phone Number" autocomplete="tel">
      <template v-if="v$.tel.$errors.length">
        <div v-for="error in v$.tel.$errors" :key="error.$uid" class="chat-form__error">{{ error.$message }}</div>
      </template>
    </div>
    <div class="chat-form__row">
      <input v-model.trim="state.email" :class="{ invalid: v$.email.$error }" :disabled="formDisabled"
             class="chat-form__field" type="email" name="chat-form-email" placeholder="Email" autocomplete="email">
      <template v-if="v$.email.$errors.length">
        <div v-for="error in v$.email.$errors" :key="error.$uid" class="chat-form__error">{{ error.$message }}</div>
      </template>
    </div>
  </form>
</template>

<style scoped lang="scss">

.chat-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: var(--rc-message-width);

  &__error {
    margin-top: 5px;
    margin-left: auto;
    width: fit-content;
    color: var(--rc-color-red);
    font-size: 10px;
    line-height: 12px;
  }

  &__field {
    padding: 12px 15px;
    width: 100%;
    border: none;
    border-radius: 0;
    outline: none;
    background: var(--color-background-mute);

    &.invalid {
      border: 1px solid var(--rc-color-red);
      background: var(--rc-color-red-light);
    }

    &::placeholder {
      opacity: .4;
    }
  }
}

</style>