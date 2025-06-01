import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox, SelectList } from "../components";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleRegister = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success(res.message || "Kayıt başarılı! Lütfen email adresinize gelen kodu girin.");
      localStorage.setItem("verifyEmail", data.email);
      navigate("/verify-code", { state: { email: data.email } });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600'>
              Tüm görevlerinizi tek bir yerde yönetin!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-400 text-blue-700'>
              <span>Bulut Tabanlı</span>
              <span>Görev Yöneticisi</span>
            </p>
          </div>
        </div>

        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-10 pt-14 pb-14'
          >
            <div>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Hoş Geldiniz!
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-500'>
                Hemen kayıt olun ve başlayın!
              </p>
            </div>
            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='Ad Soyad'
                type='text'
                name='name'
                label='Ad Soyad'
                className='w-full rounded-full'
                register={register("name", {
                  required: "Ad Soyad zorunludur!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder='Ünvan'
                type='text'
                name='title'
                label='Ünvan'
                className='w-full rounded-full'
                register={register("title", {
                  required: "Ünvan zorunludur!",
                })}
                error={errors.title ? errors.title.message : ""}
              />
              <Textbox
                placeholder='E-posta'
                type='email'
                name='email'
                label='E-posta'
                className='w-full rounded-full'
                register={register("email", {
                  required: "E-posta zorunludur!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Geçersiz e-posta adresi!",
                  },
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='Şifre'
                type='password'
                name='password'
                label='Şifre'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Şifre zorunludur!",
                  minLength: {
                    value: 6,
                    message: "Şifre en az 6 karakter olmalıdır!",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <SelectList
                label="Rol"
                name="role"
                register={register("role", {
                  required: "Rol seçimi zorunludur!",
                })}
                error={errors.role ? errors.role.message : ""}
                options={[
                  { value: "user", label: "Kullanıcı" },
                  { value: "admin", label: "Yönetici" },
                ]}
                defaultOption="Kullanıcı"
              />
              <span 
                onClick={() => navigate("/log-in")}
                className='text-sm text-gray-600 hover:underline cursor-pointer'
              >
                Zaten hesabınız var mı? Giriş yapın
              </span>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label='Kayıt Ol'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 