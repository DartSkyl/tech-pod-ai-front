<script setup>
import { ref, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, maxLength } from '@vuelidate/validators'

const phone = v => {
  if (typeof v === 'undefined' || v.length === 0) return true

  const regex = new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')
  return regex.test(v)
}

const state = reactive({
  name: '',
  tel: '',
  email: ''
})

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

const disabled = ref(false)

async function validate() {
  if (await v$.value.$validate() === false) return false

  v$.value.$reset()
  disabled.value = true
  return state
}

defineExpose({
  disabled,
  validate
})

</script>

<template>
  <form class="chat-form">
    <div class="chat-form__row">
      <div class="chat-form__wrapper">
        <input v-model.trim="state.name" :class="{ invalid: v$.name.$error }" :disabled="disabled"
               class="chat-form__field" type="text" name="chat-form-name" placeholder="Your Name"
               autocomplete="given-name">
        <div v-if="v$.name.$errors.length" :key="v$.name.$errors[0].$uid"
             class="chat-form__error">{{ v$.name.$errors[0].$message }}
        </div>
      </div>
    </div>
    <div class="chat-form__row">
      <div class="chat-form__wrapper">
        <input v-model.trim="state.tel" :class="{ invalid: v$.tel.$error }" :disabled="disabled"
               class="chat-form__field" type="text" name="chat-form-tel" placeholder="Phone Number" autocomplete="tel">
        <div v-if="v$.tel.$errors.length" :key="v$.tel.$errors[0].$uid"
             class="chat-form__error">{{ v$.tel.$errors[0].$message }}
        </div>
      </div>
    </div>
    <div class="chat-form__row">
      <div class="chat-form__wrapper">
        <input v-model.trim="state.email" :class="{ invalid: v$.email.$error }" :disabled="disabled"
               class="chat-form__field" type="email" name="chat-form-email" placeholder="Email" autocomplete="email">
        <div v-if="v$.email.$errors.length" :key="v$.email.$errors[0].$uid"
             class="chat-form__error">{{ v$.email.$errors[0].$message }}
        </div>
      </div>
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
    position: absolute;
    top: 5px;
    right: 5px;
    left: 5px;
    color: var(--rc-color-red);
    text-align: right;
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

  &__wrapper {
    position: relative;
  }
}

</style>