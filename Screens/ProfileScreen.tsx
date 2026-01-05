import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Appbar, TextInput, Button, useTheme, IconButton, Avatar, Chip, Card, Text, ActivityIndicator, Dialog, Portal, List } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigation';
import { useAppTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import apiService from '../services/apiService';
import { Profile, Skill } from '../types/user.types';
import { launchImageLibrary } from 'react-native-image-picker';

type props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'profile'>;
}

export default function ProfileScreen({ navigation }: props) {
    const theme = useTheme();
    const { isDark, toggleTheme } = useAppTheme();
    const { user } = useUser();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [bio, setBio] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [department, setDepartment] = useState('');
    const [yearOfStudy, setYearOfStudy] = useState('');
    const [location, setLocation] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [mySkills, setMySkills] = useState<string[]>([]);
    const [skillDialogVisible, setSkillDialogVisible] = useState(false);

    useEffect(() => {
        loadProfile();
        loadSkills();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const response = await apiService.getMyProfile();
            if (response.success && response.data) {
                const p = response.data;
                setProfile(p);
                setBio(p.bio || '');
                setCollegeName(p.collegeName || '');
                setDepartment(p.department || '');
                setYearOfStudy(p.yearOfStudy || '');
                setLocation(p.location || '');
                setProfileImage(p.profileImageUrl || null);
                setMySkills(p.skills || []);
                setIsEditing(false);
            } else {
                setIsEditing(true);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setIsEditing(true);
            }
            console.log('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSkills = async () => {
        try {
            const response = await apiService.getAllSkills();
            if (response.success && response.data) {
                setAllSkills(response.data);
            }
        } catch (error) {
            console.log('Error loading skills:', error);
        }
    };

    const handleSaveProfile = async () => {
        if (!bio || !collegeName || !department || !yearOfStudy || !location) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setSaving(true);
        try {
            let response;
            if (profile) {
                // Profile exists, so update it
                console.log('Updating existing profile');
                response = await apiService.updateProfile(bio, collegeName, department, yearOfStudy, location);
            } else {
                // No profile exists, create new one
                console.log('Creating new profile');
                response = await apiService.createProfile(bio, collegeName, department, yearOfStudy, location);
            }

            if (response.success) {
                Alert.alert('Success', 'Profile saved successfully');
                loadProfile();
            } else {
                Alert.alert('Error', response.message || 'Failed to save profile');
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            console.error('Error response:', error.response?.data);
            Alert.alert('Error', error.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImagePicker = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets[0]) {
            const asset = result.assets[0];
            try {
                setSaving(true);
                const formData: any = {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || 'profile.jpg',
                };
                const response = await apiService.uploadProfilePhoto(formData);
                if (response.success) {
                    Alert.alert('Success', 'Profile photo updated');
                    setProfileImage(asset.uri || null);
                    loadProfile();
                }
            } catch (error: any) {
                Alert.alert('Error', error.response?.data?.message || 'Failed to upload photo');
            } finally {
                setSaving(false);
            }
        }
    };

    const handleAddSkill = async (skillId: number) => {
        try {
            const response = await apiService.addSkillToMe(skillId);
            if (response.success) {
                Alert.alert('Success', 'Skill added successfully');
                loadProfile();
                setSkillDialogVisible(false);
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add skill');
        }
    };

    const handleRemoveSkill = async (skillName: string) => {
        const skill = allSkills.find(s => s.name === skillName);
        if (!skill) return;

        Alert.alert('Remove Skill', `Remove ${skillName} from your profile?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const response = await apiService.removeSkillFromMe(skill.id);
                        if (response.success) {
                            Alert.alert('Success', 'Skill removed');
                            loadProfile();
                        }
                    } catch (error: any) {
                        Alert.alert('Error', error.response?.data?.message || 'Failed to remove skill');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="My Profile" titleStyle={{ fontWeight: 'bold' }} />
                <IconButton
                    icon={isDark ? 'weather-sunny' : 'weather-night'}
                    size={24}
                    onPress={toggleTheme}
                    iconColor={theme.colors.primary}
                />
                {!isEditing && (
                    <IconButton
                        icon="pencil"
                        size={24}
                        onPress={() => setIsEditing(true)}
                        iconColor={theme.colors.primary}
                    />
                )}
            </Appbar.Header>

            <ScrollView style={styles.container}>
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Card.Content style={styles.avatarContainer}>
                        <Avatar.Image
                            size={100}
                            source={{ uri: 'https://via.placeholder.com/150' }}
                        />
                        <Button mode="text" onPress={handleImagePicker} disabled={saving}>
                            Change Photo
                        </Button>
                    </Card.Content>
                </Card>

                {isEditing ? (
                    <>
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    Profile Information
                                </Text>

                                <TextInput
                                    label="Bio"
                                    value={bio}
                                    onChangeText={setBio}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={3}
                                    style={styles.input}
                                    disabled={saving}
                                />

                                <TextInput
                                    label="College Name"
                                    value={collegeName}
                                    onChangeText={setCollegeName}
                                    mode="outlined"
                                    style={styles.input}
                                    disabled={saving}
                                />

                                <TextInput
                                    label="Department"
                                    value={department}
                                    onChangeText={setDepartment}
                                    mode="outlined"
                                    style={styles.input}
                                    disabled={saving}
                                />

                                <TextInput
                                    label="Year of Study"
                                    value={yearOfStudy}
                                    onChangeText={setYearOfStudy}
                                    mode="outlined"
                                    style={styles.input}
                                    disabled={saving}
                                    placeholder="e.g., 2nd Year, Final Year"
                                />

                                <TextInput
                                    label="Location"
                                    value={location}
                                    onChangeText={setLocation}
                                    mode="outlined"
                                    style={styles.input}
                                    disabled={saving}
                                />

                                <View style={styles.buttonRow}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => {
                                            if (profile) {
                                                setIsEditing(false);
                                            }
                                        }}
                                        style={styles.button}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={handleSaveProfile}
                                        style={styles.button}
                                        loading={saving}
                                        disabled={saving}
                                    >
                                        Save
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    About
                                </Text>
                                <Text variant="bodyMedium">{bio || 'No bio'}</Text>
                            </Card.Content>
                        </Card>

                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    Education
                                </Text>
                                <Text variant="bodyMedium">College: {collegeName}</Text>
                                <Text variant="bodyMedium">Department: {department}</Text>
                                <Text variant="bodyMedium">Year: {yearOfStudy}</Text>
                                <Text variant="bodyMedium">Location: {location}</Text>
                            </Card.Content>
                        </Card>
                    </>
                )}

                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Card.Content>
                        <View style={styles.skillsHeader}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                My Skills
                            </Text>
                            <Button
                                mode="outlined"
                                onPress={() => setSkillDialogVisible(true)}
                                compact
                            >
                                Add Skill
                            </Button>
                        </View>

                        <View style={styles.skillsContainer}>
                            {mySkills.map((skill, index) => (
                                <Chip
                                    key={index}
                                    mode="flat"
                                    onClose={() => handleRemoveSkill(skill)}
                                    style={styles.chip}
                                >
                                    {skill}
                                </Chip>
                            ))}
                            {mySkills.length === 0 && (
                                <Text variant="bodyMedium" style={{ opacity: 0.6 }}>
                                    No skills added yet
                                </Text>
                            )}
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>

            <Portal>
                <Dialog visible={skillDialogVisible} onDismiss={() => setSkillDialogVisible(false)}>
                    <Dialog.Title>Add Skill</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView>
                            {allSkills
                                .filter(skill => !mySkills.includes(skill.name))
                                .map((skill) => (
                                    <List.Item
                                        key={skill.id}
                                        title={skill.name}
                                        onPress={() => handleAddSkill(skill.id)}
                                        left={props => <List.Icon {...props} icon="school" />}
                                    />
                                ))}
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setSkillDialogVisible(false)}>Close</Button>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
    skillsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        marginRight: 4,
        marginBottom: 4,
    },
});
