/**
 * 에러 타입 판별 및 에러 정보 추출 유틸리티
 */

/**
 * 403 Forbidden 에러인지 확인
 * @param error - 검사할 에러 객체
 * @returns 403 에러이면 true, 아니면 false
 */
export function isForbiddenError(error: unknown): boolean {
  if (!error) return false;

  // Axios 에러 체크
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 403;
  }

  return false;
}

/**
 * 401 Unauthorized 에러인지 확인
 * @param error - 검사할 에러 객체
 * @returns 401 에러이면 true, 아니면 false
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 401;
  }

  return false;
}

/**
 * 404 Not Found 에러인지 확인
 * @param error - 검사할 에러 객체
 * @returns 404 에러이면 true, 아니면 false
 */
export function isNotFoundError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 404;
  }

  return false;
}

/**
 * HTTP 상태 코드 추출
 * @param error - 에러 객체
 * @returns HTTP 상태 코드 또는 null
 */
export function getErrorStatus(error: unknown): number | null {
  if (!error) return null;

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status ?? null;
  }

  return null;
}

/**
 * 에러 메시지 추출
 * @param error - 에러 객체
 * @param defaultMessage - 기본 메시지 (추출 실패 시)
 * @returns 에러 메시지
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "알 수 없는 오류가 발생했습니다",
): string {
  if (!error) return defaultMessage;

  // Axios 에러 응답 메시지
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
    };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  // Error 객체 메시지
  if (error instanceof Error) {
    return error.message;
  }

  // 문자열 에러
  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
}

/**
 * 클라이언트 에러 (4xx)인지 확인
 * @param error - 검사할 에러 객체
 * @returns 4xx 에러이면 true, 아니면 false
 */
export function isClientError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status !== null && status >= 400 && status < 500;
}

/**
 * 서버 에러 (5xx)인지 확인
 * @param error - 검사할 에러 객체
 * @returns 5xx 에러이면 true, 아니면 false
 */
export function isServerError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status !== null && status >= 500 && status < 600;
}
