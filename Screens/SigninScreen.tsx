import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme, ActivityIndicator, IconButton, Appbar } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigation';
import apiService from '../services/apiService';
import { useAppTheme } from '../context/ThemeContext';

type props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'signin'>;
}

export default function SigninScreen({ navigation }: props) {
    const theme = useTheme();
    const { isDark, toggleTheme } = useAppTheme();
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        if (!name || !mobileNumber || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (mobileNumber.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.signup(name, mobileNumber, email, password);
            if (response.success) {
                Alert.alert('Success', response.message || 'Account created successfully', [
                    { text: 'OK', onPress: () => navigation.replace('login') }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Signup failed');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Sign Up" titleStyle={{ fontWeight: 'bold' }} />
                <IconButton
                    icon={isDark ? 'weather-sunny' : 'weather-night'}
                    size={24}
                    onPress={toggleTheme}
                    iconColor={theme.colors.primary}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={4}>
                        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
                            Create Account
                        </Text>
                        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                            Sign up to get started
                        </Text>

                        <TextInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            left={<TextInput.Icon icon="account" />}
                            style={styles.input}
                            disabled={loading}
                        />

                        <TextInput
                            label="Mobile Number"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            keyboardType="number-pad"
                            maxLength={10}
                            mode="outlined"
                            left={<TextInput.Icon icon="phone" />}
                            style={styles.input}
                            disabled={loading}
                        />

                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            mode="outlined"
                            left={<TextInput.Icon icon="email" />}
                            style={styles.input}
                            disabled={loading}
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            mode="outlined"
                            left={<TextInput.Icon icon="lock" />}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                            style={styles.input}
                            disabled={loading}
                        />

                        <TextInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            mode="outlined"
                            left={<TextInput.Icon icon="lock-check" />}
                            right={
                                <TextInput.Icon
                                    icon={showConfirmPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            }
                            style={styles.input}
                            disabled={loading}
                        />

                        <Button
                            mode="contained"
                            onPress={handleSignup}
                            style={styles.signupButton}
                            contentStyle={styles.buttonContent}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => navigation.replace('login')}
                            style={styles.textButton}
                            disabled={loading}
                        >
                            Already have an account? Login
                        </Button>
                    </Surface>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    surface: {
        padding: 30,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.7,
    },
    input: {
        marginBottom: 16,
    },
    signupButton: {
        marginTop: 10,
        marginBottom: 10,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    textButton: {
        marginTop: 8,
    },
});
