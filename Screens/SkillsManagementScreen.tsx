import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, List, IconButton, useTheme, Dialog, Portal, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigation';
import { useAppTheme } from '../context/ThemeContext';
import apiService from '../services/apiService';
import { Skill } from '../types/user.types';

type props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'skillsManagement'>;
}

export default function SkillsManagementScreen({ navigation }: props) {
    const theme = useTheme();
    const { isDark, toggleTheme } = useAppTheme();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [newSkillName, setNewSkillName] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const response = await apiService.getAllSkills();
            if (response.success && response.data) {
                setSkills(response.data);
            }
        } catch (error) {
            console.log('Error loading skills:', error);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) {
            Alert.alert('Error', 'Please enter a skill name');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.createSkill(newSkillName.trim());
            if (response.success) {
                Alert.alert('Success', 'Skill added successfully');
                setNewSkillName('');
                setDialogVisible(false);
                loadSkills();
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add skill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Skills Management" titleStyle={{ fontWeight: 'bold' }} />
                <IconButton
                    icon={isDark ? 'weather-sunny' : 'weather-night'}
                    size={24}
                    onPress={toggleTheme}
                    iconColor={theme.colors.primary}
                />
                <IconButton
                    icon="plus"
                    size={24}
                    onPress={() => setDialogVisible(true)}
                    iconColor={theme.colors.primary}
                />
            </Appbar.Header>

            <ScrollView style={styles.container}>
                <Text variant="titleMedium" style={styles.subtitle}>
                    Available Skills ({skills.length})
                </Text>

                {skills.map((skill) => (
                    <List.Item
                        key={skill.id}
                        title={skill.name}
                        left={props => <List.Icon {...props} icon="school" />}
                        style={[styles.listItem, { backgroundColor: theme.colors.surface }]}
                    />
                ))}

                {skills.length === 0 && (
                    <Text variant="bodyLarge" style={styles.emptyText}>
                        No skills available. Add a new skill to get started!
                    </Text>
                )}
            </ScrollView>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>Add New Skill</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Skill Name"
                            value={newSkillName}
                            onChangeText={setNewSkillName}
                            mode="outlined"
                            disabled={loading}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddSkill} loading={loading} disabled={loading}>
                            Add
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    subtitle: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    listItem: {
        marginBottom: 8,
        borderRadius: 8,
        elevation: 1,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        opacity: 0.6,
    },
});
