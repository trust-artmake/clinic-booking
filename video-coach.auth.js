'use strict';
// 接続先は呼出側から受け取る。模擬画面から通信先を自動生成しない。
(() => {
  const unregistered='このアドレスは登録されていません。仁義さんに連絡してください。';
  window.VIDEO_COACH_AUTH={
    async sendCode(client,email){
      const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:false}});
      if(error)throw new Error(['user_not_found','signup_disabled','otp_disabled'].includes(error.code)?unregistered:'コードを送信できませんでした。時間を置いて確認してください。');
    },
    async verifyCode(client,email,token){
      const {data,error}=await client.auth.verifyOtp({email,token,type:'email'});
      if(error||!data?.user)throw new Error('コードを確認してください。');
      const result=await client.from('coach_members').select('id,store_id,role,is_active').eq('auth_user_id',data.user.id).eq('is_active',true).maybeSingle();
      if(result.error||!result.data?.is_active){await client.auth.signOut();throw new Error(unregistered);}
      return result.data;
    }
  };
})();
