<template>
  <el-form :model="model" :rules="rules" ref="loginForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="model.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="model.password"></el-input>
    </el-form-item>

    <button @click="submitForm('loginForm')">提交</button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      model: { username: '', password: '' },
      rules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          alert('校验成功')
        } else {
          alert('校验失败')
        }
      })
    }
  }
}
</script>