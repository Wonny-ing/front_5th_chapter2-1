const createStore = (initialState) => {
  // 상태 (클로저 내부에서 유지됨)
  let state = { ...initialState };

  // 구독자 배열
  const subscribers = new Set();

  // 상태 업데이트 함수
  const setState = (newState) => {
    state = { ...state, ...newState };
    notifySubscribers();
  };

  // 구독자에게 상태 변경 알림
  const notifySubscribers = () => {
    subscribers.forEach(callback => callback(state));
  };

  // 구독 함수
  const subscribe = (callback) => {
    subscribers.add(callback);
    // 초기 상태로 즉시 콜백 호출
    callback(state);

    // 구독 취소 함수 반환
    return () => {
      subscribers.delete(callback);
    };
  };

  // 상태 조회 함수
  const getState = () => ({ ...state });

  return {
    getState,
    setState,
    subscribe,
  };
};

export default createStore;