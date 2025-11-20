const axios = require('axios');

const PORT = process.env.PORT || 3000;
const API_URL = `http://localhost:${PORT}/api`;
let token = '';
let todoId = '';

async function runTests() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Signup
        const username = `user_${Date.now()}`;
        console.log(`\n1. Testing Signup with username: ${username}`);
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                username,
                password: 'password123'
            });
            console.log('✅ Signup successful');
        } catch (error) {
            console.error('❌ Signup failed:', error.response ? error.response.data : error.message);
        }

        // 2. Login
        console.log('\n2. Testing Login');
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password: 'password123'
            });
            token = response.data.token;
            console.log('✅ Login successful, token received');
        } catch (error) {
            console.error('❌ Login failed:', error.response ? error.response.data : error.message);
            return;
        }

        // 3. Create Todo
        console.log('\n3. Testing Create Todo');
        try {
            const response = await axios.post(`${API_URL}/todos`, {
                title: 'Test API Todo',
                description: 'Created via verification script',
                priority: 'high'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            todoId = response.data._id;
            console.log('✅ Create Todo successful');
        } catch (error) {
            console.error('❌ Create Todo failed:', error.response ? error.response.data : error.message);
        }

        // 4. Get Todos
        console.log('\n4. Testing Get Todos');
        try {
            const response = await axios.get(`${API_URL}/todos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const found = response.data.some(t => t._id === todoId);
            if (found) {
                console.log('✅ Get Todos successful (found created todo)');
            } else {
                console.error('❌ Get Todos failed (created todo not found)');
            }
        } catch (error) {
            console.error('❌ Get Todos failed:', error.response ? error.response.data : error.message);
        }

        // 5. Update Todo
        console.log('\n5. Testing Update Todo');
        try {
            const response = await axios.put(`${API_URL}/todos/${todoId}`, {
                title: 'Updated API Todo'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.title === 'Updated API Todo') {
                console.log('✅ Update Todo successful');
            } else {
                console.error('❌ Update Todo failed (title mismatch)');
            }
        } catch (error) {
            console.error('❌ Update Todo failed:', error.response ? error.response.data : error.message);
        }

        // 6. Delete Todo
        console.log('\n6. Testing Delete Todo');
        try {
            await axios.delete(`${API_URL}/todos/${todoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Delete Todo successful');
        } catch (error) {
            console.error('❌ Delete Todo failed:', error.response ? error.response.data : error.message);
        }

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

runTests();
