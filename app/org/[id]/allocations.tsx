import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AllocationCard, EmptyState, LoadingScreen, useToast } from '@/components';
import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { useAuth } from '@/contexts';
import { useAllocations } from '@/hooks/useAllocations';
import { useOrgDetails } from '@/hooks/useOrgDetails';
import type { Allocation, OrgMember } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

export default function OrgAllocationsScreen() {
    const { id, action } = useLocalSearchParams<{ id: string; action?: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const { organization, members } = useOrgDetails(id!);
    const {
        allocations,
        isLoading,
        createAllocation,
        isCreating,
        refresh,
    } = useAllocations(id!);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Open create modal if action=create
    useEffect(() => {
        if (action === 'create') {
            setShowCreateModal(true);
        }
    }, [action]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        refresh();
        setIsRefreshing(false);
    };

    const currentMember = members.find((m) => m.userId === user?.id);
    const isAdmin = currentMember?.role === 'OWNER' || currentMember?.role === 'ADMIN';

    const renderAllocation = ({ item, index }: { item: Allocation; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
            <AllocationCard allocation={item} />
        </Animated.View>
    );

    if (isLoading && allocations.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000A1A', '#001433', '#000A1A']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.title}>Allocations</Text>
                            <Text style={styles.subtitle}>{organization?.name}</Text>
                        </View>
                        {isAdmin && (
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => setShowCreateModal(true)}
                            >
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Allocations List */}
                    <FlatList
                        data={allocations}
                        renderItem={renderAllocation}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                tintColor={colors.primary}
                            />
                        }
                        ListEmptyComponent={
                            <EmptyState
                                icon="wallet-outline"
                                title="No Allocations"
                                description="Create allocations to manage budgets for teams or purposes."
                                action={isAdmin ? {
                                    label: 'Create Allocation',
                                    onPress: () => setShowCreateModal(true),
                                } : undefined}
                            />
                        }
                    />
                </SafeAreaView>
            </LinearGradient>

            <CreateAllocationModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                members={members}
                onSubmit={async (data) => {
                    try {
                        await createAllocation(data);
                        showToast('Allocation created!', 'success');
                    } catch (error: any) {
                        showToast(error.message || 'Failed to create allocation', 'error');
                        throw error;
                    }
                }}
                isLoading={isCreating}
            />
        </View>
    );
}

// Inline Create Allocation Modal
function CreateAllocationModal({
    visible,
    onClose,
    members,
    onSubmit,
    isLoading,
}: {
    visible: boolean;
    onClose: () => void;
    members: OrgMember[];
    onSubmit: (data: { name: string; description?: string; managerMemberId: string }) => Promise<void>;
    isLoading?: boolean;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedManager, setSelectedManager] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        if (!selectedManager) {
            setError('Please select a manager');
            return;
        }

        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                managerMemberId: selectedManager,
            });
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Failed to create allocation');
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setSelectedManager(null);
        setError('');
        onClose();
    };

    // Filter eligible managers (OWNER, ADMIN, MANAGER)
    const eligibleManagers = members.filter(
        (m) => ['OWNER', 'ADMIN', 'MANAGER'].includes(m.role)
    );

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={modalStyles.overlay}
            >
                <View style={modalStyles.container}>
                    <View style={modalStyles.header}>
                        <Text style={modalStyles.title}>Create Allocation</Text>
                        <TouchableOpacity onPress={handleClose} style={modalStyles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Allocation Name</Text>
                            <TextInput
                                style={[modalStyles.input, error && !name && modalStyles.inputError]}
                                placeholder="e.g. Marketing Budget"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setError('');
                                }}
                            />
                        </View>

                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Description (Optional)</Text>
                            <TextInput
                                style={[modalStyles.input, modalStyles.textArea]}
                                placeholder="What is this allocation for?"
                                placeholderTextColor={colors.textTertiary}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Manager</Text>
                            <Text style={modalStyles.helperText}>
                                Who will manage this allocation?
                            </Text>
                            {eligibleManagers.map((member) => (
                                <TouchableOpacity
                                    key={member.id}
                                    style={[
                                        modalStyles.managerItem,
                                        selectedManager === member.id && modalStyles.managerItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedManager(member.id);
                                        setError('');
                                    }}
                                >
                                    <View style={modalStyles.managerRadio}>
                                        {selectedManager === member.id && (
                                            <View style={modalStyles.managerRadioInner} />
                                        )}
                                    </View>
                                    <View style={modalStyles.managerInfo}>
                                        <Text style={modalStyles.managerName}>{member.user.displayName}</Text>
                                        <Text style={modalStyles.managerRole}>{member.role}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {error ? <Text style={modalStyles.errorText}>{error}</Text> : null}
                    </ScrollView>

                    <TouchableOpacity
                        style={[modalStyles.submitBtn, isLoading && modalStyles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={modalStyles.submitBtnText}>Create Allocation</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000A1A',
        minHeight: screenHeight,
    },
    gradient: {
        flex: 1,
        minHeight: screenHeight,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 40,
    },
});

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodyBold,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    helperText: {
        ...typography.small,
        color: colors.textTertiary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputError: {
        borderColor: colors.error,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    managerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    managerItemSelected: {
        borderColor: colors.primary,
    },
    managerRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    managerRadioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    managerInfo: {
        flex: 1,
    },
    managerName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    managerRole: {
        ...typography.small,
        color: colors.textSecondary,
    },
    errorText: {
        ...typography.small,
        color: colors.error,
        marginBottom: spacing.md,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
});
