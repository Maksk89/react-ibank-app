import React, {useEffect, useState} from 'react';
import ContextButton from '../../ui/ContextButton/ContextButton';
import Modal from '../../ui/Modal/Modal';
import NewDeposit from './NewDeposit/NewDeposit';
import Loader from '../../ui/Loader/Loader';
import {getJSON} from '../../utils/http';
import {rub} from '../../utils/format';

const Deposits = () => {
  const [newDepositModalOpen, setNewDepositModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      setData(await getJSON('/deposits'));
    } catch (e) {
      setData(null);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDeposit = () => {
    setNewDepositModalOpen(true);
  };
  const handleNewDepositModalClose = () => {
    setNewDepositModalOpen(false);
  };
  const handleNewDepositComplete = () => {
    setNewDepositModalOpen(false);
    loadData();
  };
  const handleRetry = async () => {
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div data-testid="loading">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error">
        <p>Произошла ошибка</p>
        <ContextButton onClick={handleRetry}>Повторить попытку</ContextButton>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div data-testid="no-deposits">
        <p>У вас нет вкладов</p>
        <ContextButton onClick={handleNewDeposit}>Открыть вклад</ContextButton>
        {newDepositModalOpen && <Modal onClose={handleNewDepositModalClose}>
          <NewDeposit onComplete={handleNewDepositComplete}/>
        </Modal>}
      </div>
    );
  }

  if (data) {
    return (
      <>
        {data?.map((deposit) => <div data-testid="deposit" key={deposit?.id}>
            <span data-testid="title">{deposit?.title}</span>
            <span data-testid="finish">До {deposit?.finish}</span>
            <span data-testid="balance">{rub(deposit?.balance)}</span>
          </div>
        )}
      </>
    )
  }
};

Deposits.propTypes = {};

export default Deposits;
