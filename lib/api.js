import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJson(req) {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? body : {};
  } catch {
    const err = new Error('Invalid JSON body');
    err.status = 400;
    throw err;
  }
}

export function isValidObjectId(id) {
  return typeof id === 'string' && mongoose.isValidObjectId(id);
}

/**
 * Wraps a route handler so thrown auth errors (401/403), bad input and
 * unexpected failures become JSON responses instead of HTML 500 pages.
 */
export function withErrors(handler) {
  return async function wrapped(...args) {
    try {
      return await handler(...args);
    } catch (err) {
      // Let Next.js control-flow errors (dynamic usage detection, redirect, notFound) through.
      const digest = typeof err?.digest === 'string' ? err.digest : '';
      if (digest === 'DYNAMIC_SERVER_USAGE' || digest.startsWith('NEXT_')) throw err;
      if (err?.status) return jsonError(err.message, err.status);
      if (err?.name === 'CastError' || err?.name === 'ValidationError') {
        return jsonError('Invalid request', 400);
      }
      console.error(err);
      return jsonError('Something went wrong. Please try again.', 500);
    }
  };
}
