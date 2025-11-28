import React, { useState } from 'react';
import { X, CreditCard, Banknote, MapPin } from 'lucide-react';

export function CheckoutModal({ onClose, onConfirm, total }) {
    const [savedAddresses, setSavedAddresses] = useState(() => {
        const saved = localStorage.getItem('addresses');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [showAddressForm, setShowAddressForm] = useState(savedAddresses.length === 0);
    const [newAddress, setNewAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSaveAddress = () => {
        if (!newAddress.trim()) return;
        const updated = [...savedAddresses, newAddress];
        setSavedAddresses(updated);
        localStorage.setItem('addresses', JSON.stringify(updated));
        setNewAddress('');
        setShowAddressForm(false);
        setSelectedAddressIndex(updated.length - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalAddress = '';
        if (showAddressForm) {
            if (!newAddress.trim()) return;
            finalAddress = newAddress;
            // Auto-save if it's the first one or user explicitly added it (handled by save button usually, but here we handle submit)
            if (savedAddresses.length === 0) {
                const updated = [newAddress];
                setSavedAddresses(updated);
                localStorage.setItem('addresses', JSON.stringify(updated));
            }
        } else {
            finalAddress = savedAddresses[selectedAddressIndex];
        }

        setIsProcessing(true);
        setTimeout(() => {
            onConfirm({ address: finalAddress, paymentMethod });
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                width: '100%',
                maxWidth: '400px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} color="#666" />
                </button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Finalizar Compra</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                            <MapPin size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            Dirección de Entrega
                        </label>

                        {!showAddressForm && savedAddresses.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                {savedAddresses.map((addr, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '0.5rem',
                                        padding: '0.5rem',
                                        border: selectedAddressIndex === index ? '1px solid var(--color-primary)' : '1px solid #eee',
                                        borderRadius: '8px',
                                        backgroundColor: selectedAddressIndex === index ? '#e8f5e9' : 'white',
                                        cursor: 'pointer'
                                    }}
                                        onClick={() => setSelectedAddressIndex(index)}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddressIndex === index}
                                            onChange={() => setSelectedAddressIndex(index)}
                                            style={{ marginTop: '4px', marginRight: '8px' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: '#555' }}>{addr}</span>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setShowAddressForm(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-primary)',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        marginTop: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    + Agregar nueva dirección
                                </button>
                            </div>
                        )}

                        {showAddressForm && (
                            <div style={{ animation: 'fadeIn 0.3s' }}>
                                <textarea
                                    required={showAddressForm}
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    placeholder="Calle, Número, Colonia..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontFamily: 'inherit',
                                        resize: 'none',
                                        height: '80px',
                                        marginBottom: '0.5rem'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={handleSaveAddress}
                                        disabled={!newAddress.trim()}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            backgroundColor: '#333',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Guardar Dirección
                                    </button>
                                    {savedAddresses.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressForm(false)}
                                            style={{
                                                padding: '0.5rem',
                                                background: 'none',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                            Método de Pago
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cash')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: `2px solid ${paymentMethod === 'cash' ? 'var(--color-primary)' : '#eee'}`,
                                    backgroundColor: paymentMethod === 'cash' ? '#e8f5e9' : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Banknote size={24} color={paymentMethod === 'cash' ? 'var(--color-primary)' : '#666'} />
                                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Efectivo</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: `2px solid ${paymentMethod === 'card' ? 'var(--color-primary)' : '#eee'}`,
                                    backgroundColor: paymentMethod === 'card' ? '#e8f5e9' : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <CreditCard size={24} color={paymentMethod === 'card' ? 'var(--color-primary)' : '#666'} />
                                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Tarjeta</span>
                            </button>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '1px solid #eee',
                        paddingTop: '1rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}>
                        <span>Total a Pagar:</span>
                        <span style={{ color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing || (showAddressForm && !newAddress.trim())}
                        className="btn-add"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            opacity: isProcessing ? 0.7 : 1,
                            cursor: isProcessing ? 'wait' : 'pointer'
                        }}
                    >
                        {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                </form>
            </div>
        </div>
    );
}
