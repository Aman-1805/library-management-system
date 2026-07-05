document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('formContainer');
    const toggleMode = document.getElementById('toggleMode');
    const subtitle = document.getElementById('subtitle');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    let isLogin = true;

    function renderForm() {
        errorMsg.classList.add('hidden');
        successMsg.classList.add('hidden');
        
        if (isLogin) {
            subtitle.textContent = "Sign in to manage the system";
            toggleMode.textContent = "Create an account instead";
            formContainer.innerHTML = `
                <form id="authForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input type="text" id="username" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
                        Sign In
                    </button>
                </form>
            `;
        } else {
            subtitle.textContent = "Register a new admin account";
            toggleMode.textContent = "Already have an account? Sign in";
            formContainer.innerHTML = `
                <form id="authForm" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Username</label>
                        <input type="text" id="username" required minlength="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" id="password" required minlength="6" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <input type="password" id="confirmPassword" required minlength="6" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition">
                        Create Account
                    </button>
                </form>
            `;
        }

        document.getElementById('authForm').addEventListener('submit', handleSubmit);
    }

    toggleMode.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        renderForm();
    });

    async function handleSubmit(e) {
        e.preventDefault();
        errorMsg.classList.add('hidden');
        successMsg.classList.add('hidden');

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!isLogin) {
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                errorMsg.textContent = "Passwords do not match!";
                errorMsg.classList.remove('hidden');
                return;
            }
        }

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/';
                } else {
                    successMsg.textContent = "Account created successfully! Switching to login...";
                    successMsg.classList.remove('hidden');
                    setTimeout(() => {
                        isLogin = true;
                        renderForm();
                    }, 2000);
                }
            } else {
                errorMsg.textContent = data.error || 'Request failed';
                errorMsg.classList.remove('hidden');
            }
        } catch (err) {
            errorMsg.textContent = 'Network error. Make sure server is running.';
            errorMsg.classList.remove('hidden');
        }
    }

    // Initial render
    renderForm();
});
